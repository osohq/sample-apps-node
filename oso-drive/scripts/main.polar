actor User { }

resource Organization {
    roles = ["admin", "member"];

    "member" if "admin";
}

resource Folder {
    roles = ["reader", "writer"];
    relations = {
        folder: Folder,
        organization: Organization
    };

    role if role on "folder";
    "writer" if "admin" on "organization";
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

has_role(user: User, "reader", folder: Folder) if
  organization matches Organization and
  is_readable_by_org(folder) and
  has_role(user, "member", organization);

has_role(user: User, "reader", file: File) if
  organization matches Organization and
  is_readable_by_org(file) and
  has_role(user, "member", organization);

has_permission(_user: User, "read", file: File) if
  is_public(file);
