actor User { }

resource Organization {
    roles = ["admin", "member"];
}

resource Folder {
    roles = ["reader", "writer", "member", "admin"];
    relations = {
        folder: Folder,
        organization: Organization
    };

    role if role on "folder";
    role if role on "organization";
    "writer" if "admin" on "organization";
}

resource File {
    permissions = ["read", "write"];
    roles = ["reader", "writer", "member", "admin"];
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

has_permission(user: User, "read", file: File) if
  is_readable_by_org(file) and
  has_role(user, "member", file);

has_permission(_user: User, "read", file: File) if
  is_public(file);