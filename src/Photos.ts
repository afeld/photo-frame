import flatMap from "lodash.flatmap";
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

const photosFromBatch = (response?: FBBatchResponse) => {
  // exclude the friends' non-response
  if (!response) {
    return [];
  }
  const json = JSON.parse(response.body);
  if (json.error) {
    console.error(json.error.message);
    return [];
  }
  // there is one key+value pair per user
  const photosResponses = Object.values(json) as PhotosResponse[];
  return flatMap(photosResponses, photosFromUser);
};

const onPhotosFetched = (responses: FBBatchResponse[]) => {
  const photos = flatMap(responses, photosFromBatch);
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

        // my tagged photos
        {
          method: "GET",
          relative_url: `photos?fields=${photoFields}&ids=me`
        },
        // my uploaded photos
        {
          method: "GET",
          relative_url: `photos?type=uploaded&fields=${photoFields}&ids=me`
        },

        // -- split from requests above so that own photos are retrieved even if user has no friends --

        // others' tagged photos
        {
          method: "GET",
          relative_url: `photos?fields=${photoFields}&ids={result=friends:$.data.*.id}`
        },
        // others' uploaded photos
        {
          method: "GET",
          relative_url: `photos?type=uploaded&fields=${photoFields}&ids={result=friends:$.data.*.id}`
        }
      ]
    },
    (responses: FBBatchResponse[]) => {
      const photos = onPhotosFetched(responses);
      cb(photos);
    }
  );
}
