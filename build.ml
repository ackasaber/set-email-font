#use "topfind"
#require "core"
#require "core_unix"
#require "stdio"
#require "camlzip"
#require "yojson"

open Core
open Stdio

let filelist = {|
  manifest.json
  LICENSE
  background.html
  background.js
  options
  images/icon-16px.png
  images/icon-32px.png
  images/icon-64px.png
|}

(** Parse the input list *)
let parse_filelist filelist =
  String.split_lines filelist |>
  List.map ~f:String.strip |>
  List.filter ~f:(fun line -> not (String.is_empty line))

type manifest_info = { name: string; version: string }

(** Parse the add-on name from its id.
    Assumes the recommended id format {[AUTHOR.NAME@DOMAIN]} *)
let parse_addon_name id =
  let prefix =
    (match String.rsplit2 ~on:'@' id with
    | None -> id
    | Some (prefix, _) -> prefix) in
  (match String.rsplit2 ~on:'.' prefix with
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
let rec add_entry zip filename =
  let open Core_unix in
  let s = stat filename in
  match s.st_kind with
  | S_REG ->
    printf "Adding %s\n" filename;
    Zip.copy_file_to_entry filename zip filename ~mtime:s.st_mtime
  | S_DIR ->
    printf "Adding %s\n" filename;
    Zip.add_entry "" zip ~mtime:s.st_mtime
      (if Filename.check_suffix filename "/"
       then filename else filename ^ "/");
    opendir filename |>
    add_directory_entries zip filename
  | _ -> ()

and add_directory_entries zip parent dir =
  let open Core_unix in
  match readdir_opt dir with
  | None -> closedir dir
  | Some filename ->
    (if not (String.equal filename ".") &&
        not (String.equal filename "..") then
      add_entry zip (Filename.concat parent filename));
    add_directory_entries zip parent dir

let zip_files filename filelist =
  let zip = Zip.open_out filename in
  List.iter ~f:(add_entry zip) filelist;
  Zip.close_out zip

let () =
  let { name; version } = extract_manifest_info "manifest.json" in
  let final_name = addon_filename name version in
  parse_filelist filelist |>
  zip_files final_name
  