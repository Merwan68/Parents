export default async function handler(req, res) {

  // Allow your GitHub Pages website to access this API
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://merwan68.github.io"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );


  // Browser CORS preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }


  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }


  try {

    const { sender, message } = req.body;


    // Check message data
    if (!sender || !message) {
      return res.status(400).json({
        error: "Missing sender or message"
      });
    }


    // Get Telegram credentials from Vercel
    const botToken =
      process.env.TELEGRAM_BOT_TOKEN;

    const chatId =
      process.env.TELEGRAM_CHAT_ID;


    // Make sure credentials exist
    if (!botToken || !chatId) {
      return res.status(500).json({
        error: "Telegram configuration is missing"
      });
    }


    // Telegram message
    const text =
      `💬 NEW FAMILY MESSAGE\n\n` +
      `👤 From: ${sender}\n\n` +
      `📝 Message:\n${message}`;


    // Send message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      }
    );


    const result =
      await telegramResponse.json();


    // Telegram error
    if (!result.ok) {
      console.error(
        "Telegram error:",
        result
      );

      return res.status(500).json({
        error: "Telegram could not send the message"
      });
    }


    // Success
    return res.status(200).json({
      success: true
    });


  } catch (error) {

    console.error(
      "Server error:",
      error
    );

    return res.status(500).json({
      error: "Server error"
    });

  }
}
