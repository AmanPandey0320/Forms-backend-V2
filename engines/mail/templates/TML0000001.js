const TML0000001 = {
  code: "TML0000001",
  name: "user signin email template",
  subject: "Welcome from FORMS!",
  body: ([name, ip]) => {
    const body = `<h1>Welcome! ${name}</h1><p>Hi! ${name} welcome to forms.</p><p>It's our pleasure to have you here on a new journey with us.</p><p>Thanking you</p><p><h3>Team Forms</h3></p>`;
    return body;
  },
};

module.exports = TML0000001;
