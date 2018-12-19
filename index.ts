import * as express from 'express';
import * as fetch from 'isomorphic-fetch';

const server = express();

server.use('/:insta_username', async (req, res, next) => {
  try {
    const instaPage = await fetch(`https://instagram.com/${req.params.insta_username}`);
    const rawResult = await instaPage.text()
    const jsonObjectRaw = rawResult.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)
    const jsonObject = JSON.parse(jsonObjectRaw);

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
      profileName: req.params.insta_username,
      follower: followerCount,
      following: followingCount,
      niceName,
      email,
      isPrivate: isPrivate ? 'yes' : 'no',
      profilePicUrl,
      biography,
      linkInBio: external_url,
    });
  } catch (err) {
    res.json({
      error: err,
    })
  }
});

server.listen(4000);