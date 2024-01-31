actor User {}
  
resource Repository {
  roles = ["contributor"];
  permissions = ["read"];

  "read" if "contributor";
}
