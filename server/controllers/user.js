// import fs from "fs";
// import path from "path";
// import mongoose from "mongoose";
// import Admin from "../models/adminModel.js";
// import Employee from "../models/employeeModel.js";
// const usersModel = [Admin, Employee];

// // Function to get logged-in user data
// // export const getLoggedInUserData = async (req, res) => {
// //   const _id = req.user.id;
// //   // Check if the provided ID is valid
// //   if (!mongoose.Types.ObjectId.isValid(_id)) {
// //     return res.status(400).json({ success: false, message: "Invalid User ID" });
// //   }

// //   try {
// //     // Iterate through each user model to find the user by ID
// //     for (const model of usersModel) {
// //       const user = await model.findById(_id);
// //       if (user) {
// //         return res.status(200).json({ success: true, result: user });
// //       }
// //     }
// //     // If user is not found in any model, return 404
// //     return res.status(404).json({ success: false, message: "User not found" });
// //   } catch (error) {
// //     // Handle any errors that occur during the process
// //     return res
// //       .status(500)
// //       .json({ success: false, message: "Something went wrong", error: error });
// //   }
// // };

// // Function to update user profile picture
// export const updateUserProfilePic = async (req, res) => {
//   const _id = req.user.id;
//   const profile_picture = req.file ? req.file.filename : null;

//   // Check if the provided ID is valid
//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(400).json({ success: false, message: "Invalid User ID" });
//   }

//   // Check if profile picture is provided
//   if (!profile_picture) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Profile picture is required" });
//   }

//   try {
//     // Iterate through each user model to find the user by ID
//     for (const model of usersModel) {
//       const user = await model.findById(_id).select("-password -__v ");
//       if (user) {
//         // If user has an old profile picture, delete it
//         if (user.profile_picture) {
//           const oldProfilePicPath = path.join("uploads/", user.profile_picture); // Adjust the path as necessary
//           if (fs.existsSync(oldProfilePicPath)) {
//             fs.unlink(oldProfilePicPath, (err) => {
//               if (err) {
//                 console.error("Failed to delete old profile picture:", err);
//               }
//             });
//           }
//         }

//         // Update the user with the new profile picture
//         user.profile_picture = profile_picture;
//         await user.save();

//         // Return the updated user data
//         return res.status(200).json({
//           success: true,
//           result: user,
//           message: "Profile picture updated successfully",
//         });
//       }
//     }

//     // If user is not found in any model, return 404
//     return res.status(404).json({ success: false, message: "User not found" });
//   } catch (err) {
//     // Handle any errors that occur during the process
//     return res
//       .status(500)
//       .json({ success: false, message: "Something went wrong", error: err });
//   }
// };
