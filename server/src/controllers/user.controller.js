import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../../gemini.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: "get current user error",
    });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageURL } = req.body;
    let assistantImage;

    console.log("Received body:", req.body);
    console.log("Received file:", req.file);

    if (req.file && req.file.path) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else if (imageURL) {
      assistantImage = imageURL;
    } else {
      return res.status(400).json({ message: "No assistant image provided" });
    }

    if (!assistantName) {
      return res.status(400).json({ message: "Assistant name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Update assistant error:", error);
    return res.status(400).json({
      message: "Update assistant error",
      error: error.message,
    });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;
    const result = await geminiResponse(command, assistantName, userName);
    const jsonMatch = result.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format(`YYYY-MM-DD`)}`,
        });
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format(`hh:mmA`)}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format(`dddd`)}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format(`MMMM`)}`,
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "linkedin_open":
      case "weather_show":
      case "notion_open":
         return res.json({
          type,
          command: gemResult.command,
          response: gemResult.response,
        });
      default:
        return res.status(400).json({
          response: "I didn't understand that command.",
        });
    }
  } catch (error) {
    console.error("Ask assistant error:", error);
    return res.status(500).json({
      response: "Ask assistant error.",
    });
  }
};
