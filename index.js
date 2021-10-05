Hooks.on("getChatLogEntryContext", (html, options) => {
  const indexOfApplyHealing = options.findIndex(
    (option) => option.name === "Apply Healing"
  );
  const canApply = (li) => {
    const message = game.messages.get(li.data("messageId"));
    return (
      message?.isRoll &&
      message?.isContentVisible &&
      canvas.tokens?.controlled.length
    );
  };
  const applyTempHp = (li) => {
    const message = game.messages.get(li.data("messageId"));
    const roll = message.roll;
    return Promise.all(
      canvas.tokens.controlled.map(({ actor }) => {
        const actorData = actor.data.data;
        const greatestValue = Math.max(
          roll.total,
          actorData.attributes.hp.temp
        );
        return actor.update({ "data.attributes.hp.temp": greatestValue });
      })
    );
  };

  options.splice(indexOfApplyHealing + 1, 0, {
    name: "Apply Temp HP",
    icon: "<i class='fas fa-shield-alt'></i>",
    condition: canApply,
    callback: (li) => applyTempHp(li, 1),
  });
  return options;
});
