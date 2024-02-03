actor User { }

resource Folder {
    roles = ["reader", "writer"];
    relations = {
        folder: Folder,
    };

    role if role on "folder";
}

resource File {
    permissions = ["read", "write"];
    roles = ["reader", "writer"];
    relations = {
        folder: Folder,
        owner: User
    };

    "write" if "owner";

    role if role on "folder";

    "read" if "write";
    "read"  if "reader";
    "write" if "writer";
}

has_permission(_user: User, "read", file: File) if
  is_public(file);