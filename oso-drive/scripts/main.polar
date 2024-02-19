actor User { }

resource Organization {
    roles = ["admin", "member"];

    "member" if "admin";
}

resource Folder {
    permissions = ["read", "write"];
    roles = ["reader", "writer"];
    relations = {
        folder: Folder,
        organization: Organization,
        owner: User
    };

    "writer" if "owner";

    role if role on "folder";
    "writer" if "admin" on "organization";

    "read" if "write";
    "read"  if "reader";
    "write" if "writer";
}

resource File {
    permissions = ["read", "write"];
    roles = ["reader", "writer"];
    relations = {
        folder: Folder,
        owner: User
    };

    "writer" if "owner";

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

has_role(user: User, "reader", file: File) if
    organization matches Organization and
    folder matches Folder and
    is_readable_by_org(folder) and
    has_relation(file, "folder", folder) and
    has_role(user, "member", organization);

has_permission(_user: User, "read", file: File) if
    is_public(file);

test "can write folder and contents if file owner" {
    setup {
        has_relation(File{"tps-reports/tps-report-1999.txt"}, "owner", User{"Peter"});
    }

    assert allow(User{"Peter"}, "write", File{"tps-reports/tps-report-1999.txt"});
    assert_not allow(User{"Michael"}, "write", File{"tps-reports/tps-report-1999.txt"});
}

test "can write folder and contents if folder owner" {
    setup {
        has_relation(Folder{"tps-reports"}, "owner", User{"Bill"});
        has_relation(File{"tps-reports/tps-report-1999.txt"}, "folder", Folder{"tps-reports"});
        has_relation(File{"payroll/office-expenses.txt"}, "folder", Folder{"payroll"});
    }

    assert allow(User{"Bill"}, "write", File{"tps-reports/tps-report-1999.txt"});
    assert allow(User{"Bill"}, "write", Folder{"tps-reports"});
    assert_not allow(User{"Peter"}, "write", Folder{"tps-reports"});
}

test "can read folder if member of org and folder is readable by org" {
    setup {
        has_role(User{"Samir"}, "member", Organization{"Initech"});
        has_relation(Folder{"tps-reports"}, "organization", Organization{"Initech"});
        has_relation(Folder{"payroll"}, "organization", Organization{"Initech"});
        is_readable_by_org(Folder{"tps-reports"});
    }

    assert allow(User{"Samir"}, "read", Folder{"tps-reports"});
    assert_not allow(User{"Samir"}, "read", Folder{"payroll"});
}

test "can read file if member of org and folder is readable by org" {
    setup {
        has_role(User{"Samir"}, "member", Organization{"Initech"});
        has_relation(Folder{"tps-reports"}, "organization", Organization{"Initech"});
        has_relation(Folder{"payroll"}, "organization", Organization{"Initech"});
        is_readable_by_org(Folder{"tps-reports"});
        has_relation(File{"tps-reports/tps-report-1999.txt"}, "folder", Folder{"tps-reports"});
        has_relation(File{"payroll/office-expenses.txt"}, "folder", Folder{"payroll"});
    }

    assert allow(User{"Samir"}, "read", File{"tps-reports/tps-report-1999.txt"});
    assert_not allow(User{"Samir"}, "read", File{"payroll/office-expenses.txt"});
}
