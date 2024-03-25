import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js"; // User can directly communicate with the DB
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "ok",
  // });

  // get user details from frontend
  const { fullName, email, username, password } = req.body;
  // console.log("email: ", email);

  // validation: is empty?
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  // check if user/email exits
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], // check using the operator in DB
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already exits");
  }
  // console.log(req.files);

  // check for images, handling images
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // check if avatar is available
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  // upload to cloudinary (will take time)
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // check if avatar exits else DB breaks
  if (!avatar) {
    throw new apiError(400, "Avatar file is required");
  }

  // user entry in DB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // validation for coverImage
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refresh token
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // '-' matlab not required
  );

  // check if user created or not
  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  // return response if the user is created
  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
