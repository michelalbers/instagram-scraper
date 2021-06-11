import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function (req: VercelRequest, res: VercelResponse) {
  const username = req.query.username;
  console.log(username);
  console.log(`Fetching https://instagram.com/${username}`)
  const instaPage = await fetch(`https://instagram.com/${username}`);
  const rawResult = await instaPage.text()
  console.log(rawResult)
  const jsonObjectRaw = rawResult.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)
  const jsonObject = JSON.parse(jsonObjectRaw);
  console.log(jsonObject)

  const {
    entry_data: {
      ProfilePage: {
        0: {
          graphql: {
            user: {
              biography,
              external_url,
              edge_followed_by: {
                count: followerCount,
              },
              edge_follow: {
                count: followingCount,
              },
              full_name: niceName,
              business_email: email,
              is_private: isPrivate,
              profile_pic_url: profilePicUrl,
            }
          }
        }
      }
    }
  } = jsonObject;
  res.json({
    profileName: username,
    follower: followerCount,
    following: followingCount,
    niceName,
    email,
    isPrivate: isPrivate ? 'yes' : 'no',
    profilePicUrl,
    biography,
    linkInBio: external_url,
  });
}
