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

const photosFromUser = (response: PhotosResponse) => {
  if (response.error) {
    console.error(response.error.message);
  }
  return response.data || [];
};

const onPhotosFetched = (responses: FBBatchResponse[]) => {
  const photos = responses.reduce(
    (acc, response) => {
      // exclude the friends' non-response
      if (!response) {
        return acc;
      }
      const json = JSON.parse(response.body);
      // there is one key+value pair per user
      const photosResponses = Object.values(json) as PhotosResponse[];
      return photosResponses.reduce((innerAcc, photosRes) => {
        const photos = photosFromUser(photosRes);
        return innerAcc.concat(photos);
      }, acc);
    },
    [] as pf.Photo[]
  );

  return uniqBy(photos, photo => photo.id);
};

export function getPhotos(
  FB: fb.FacebookStatic,
  cb: (photos: pf.Photo[]) => void
) {
  const photoFields = "name,webp_images";
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
          relative_url: `photos?fields=${photoFields}&ids=me,{result=friends:$.data.*.id}`
        },
        // uploaded photos
        {
          method: "GET",
          relative_url: `photos?type=uploaded&fields=${photoFields}&ids=me,{result=friends:$.data.*.id}`
        }
      ]
    },
    (responses: FBBatchResponse[]) => {
      const photos = onPhotosFetched(responses);
      cb(photos);
    }
  );
}
