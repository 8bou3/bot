module.exports = {
  customId: "create_ticket",
  async press(interaction, Data) {
    let options = Data.guild.tickets.options[0]
      ? Data.guild.tickets.options
      : [
          {
            label: "Help",
            description: "Get help from the support team",
          },
          {
            label: "Report",
            description: "Report user, mod or content",
          },
        ];

    let i = 0;
    options.forEach((option) => {
      option.value = `${i}`;
      i += 1;
    });

    interaction
      .editReply({
        content: "Press the button to create a ticket",
        components: [
          {
            components: [
              {
                customId: "create_ticket",
                placeholder: "Choose your ticket type...",
                options: options,
                type: "SELECT_MENU",
              },
            ],
            type: "ACTION_ROW",
          },
        ],
      })
      .catch(console.error);
  },
};
