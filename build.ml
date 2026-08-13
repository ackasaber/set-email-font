#use "topfind"
#require "camlzip"
#require "yojson"

(** Reads the list of files and folders to package *)
let read_filelist filename =
  In_channel.with_open_text filename In_channel.input_lines

type manifest_info = { name: string; version: string }

(** Parse the add-on name from its id.
    Assumes the recommended id format {[AUTHOR.NAME@DOMAIN]} *)
let parse_addon_name id =
  let prefix =
    (match String.split_last ~sep:"@" id with
    | None -> id
    | Some (prefix, _) -> prefix) in
  (match String.split_last ~sep:"." prefix with
  | None -> prefix
  | Some (_, name) -> name)

(** Read the add-on name and version from its manifest *)
let extract_manifest_info filename =
  let json = Yojson.Basic.from_file filename in
  let open Yojson.Basic.Util in
  let version = json |> member "version" |> to_string in
  let id = json |> member "browser_specific_settings" |>
    member "gecko" |> member "id" |> to_string in
  let name = parse_addon_name id in
  { name; version }

let addon_filename name version =
  name ^ "-" ^ version ^ ".xpi"

(** Add a file or directory to the zip archive *)
let rec add_entry zip path =
  if Sys.is_regular_file path then begin
    Printf.printf "Adding %s\n" path;
    Zip.copy_file_to_entry path zip path;
  end else if Sys.is_directory path then begin
    Printf.printf "Adding %s\n" path;
    Zip.add_entry "" zip (path ^ "/");
    let entries = Sys.readdir path in
    let add_dir_entry entry =
      add_entry zip (Filename.concat path entry) in
    Array.iter add_dir_entry entries
  end

let zip_files filename filelist =
  let zip = Zip.open_out filename in
  List.iter (add_entry zip) filelist;
  Zip.close_out zip

let () =
  let { name; version } = extract_manifest_info "manifest.json" in
  let final_name = addon_filename name version in
  read_filelist "package-files.txt" |>
  zip_files final_name
  