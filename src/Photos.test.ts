import { onPhotosFetched } from "./Photos";

it("handles null responses", () => {
  const responses = [null];
  expect(onPhotosFetched(responses)).toEqual([]);
});

it("gives the unique photos by ID", () => {
  const response = {
    body: JSON.stringify({
      me: {
        data: [{ id: "123" }]
      }
    })
  };
  const responses = [response, response];
  expect(onPhotosFetched(responses)).toEqual([{ id: "123" }]);
});

it("ignores errors", () => {
  const responses = [
    {
      body: JSON.stringify({
        error: {
          message: "something something"
        }
      })
    },
    {
      body: JSON.stringify({
        me: {
          data: [{ id: "123" }]
        },
        other: {
          error: {
            message: "something something"
          }
        }
      })
    }
  ];
  expect(onPhotosFetched(responses)).toEqual([{ id: "123" }]);
});
