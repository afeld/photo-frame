import uniqBy from "lodash.uniqby";

interface FBBatchResponse {
  body: string;
}

interface FBError {
  message: string;
}

interface PhotosResponse {
  data?: pf.Photo[];
  error?: FBError;
}

const onPhotosFetched = (responses: FBBatchResponse[]) => {
  const photos = responses.reduce(
    (acc, response) => {
      if (!response) {
        return acc;
      }
      const json = JSON.parse(response.body) as PhotosResponse;
      if (json.error) {
        console.error(json.error.message);
      }
      return Object.values(json).reduce(
        (innerAcc, photoRes) => innerAcc.concat(photoRes.data),
        acc
      );
    },
    [] as pf.Photo[]
  );

  return uniqBy(photos, photo => photo.id);
};

export function getPhotos(
  FB: fb.FacebookStatic,
  cb: (photos: pf.Photo[]) => void
) {
  // batch requests
  // https://stackoverflow.com/a/16001318/358804
  // https://developers.facebook.com/docs/graph-api/making-multiple-requests#operations
  // https://developers.facebook.com/docs/graph-api/advanced#largerequests
  FB.api(
    "/",
    "post",
    {
      include_headers: false,
      batch: [
        {
          method: "GET",
          name: "friends",
          relative_url: "me/friends?fields=id"
        },
        // tagged photos
        {
          method: "GET",
          relative_url:
            "photos?fields=name,webp_images&ids=me,{result=friends:$.data.*.id}"
        },
        // uploaded photos
        {
          method: "GET",
          relative_url:
            "photos?type=uploaded&fields=name,webp_images&ids=me,{result=friends:$.data.*.id}"
        }
      ]
    },
    (responses: FBBatchResponse[]) => {
      const photos = onPhotosFetched(responses);
      cb(photos);
    }
  );
}
