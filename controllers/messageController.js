import Message from "../dao/models/Messages.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();

    const formattedMessages = messages.map((message) => ({
      user: String(message.user),
      message: String(message.message),
    }));

    res.render("messages", { messages: formattedMessages });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const createMessage = async (req, res) => {
  try {
    if (!req.body || !req.body.user || !req.body.message) {
      throw new Error("Invalid request body");
    }

    const { user, message } = req.body;
    const newMessage = new Message({ user, message });
    await newMessage.save();
    res.redirect("/messages");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
};
