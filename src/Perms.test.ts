import { arePermissionsGranted } from "./Perms";

it("returns true if all permissions present", () => {
  const perms = [
    { permission: "user_friends", status: "granted" },
    { permission: "user_photos", status: "granted" }
  ];
  expect(arePermissionsGranted(perms)).toBeTruthy();
});

it("returns false if permission missing", () => {
  expect(arePermissionsGranted([])).toBeFalsy();
});
