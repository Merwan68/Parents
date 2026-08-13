export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { sender, message } = req.body;

    if (!sender || !message) {
      return res.status(400).json({
        error: "Missing sender or message"
      });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({
        error: "Telegram configuration is missing"
      });
    }

    const text =
      `💬 NEW FAMILY MESSAGE\n\n` +
      `👤 From: ${sender}\n\n` +
      `📝 Message:\n${message}`;

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

    const result = await telegramResponse.json();

    if (!result.ok) {
      return res.status(500).json({
        error: "Telegram could not send the message"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
}
