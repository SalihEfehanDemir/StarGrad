import React from 'react';
import ToolCard from '../ToolCard';

const FocusCard = React.memo(({ focus, setFocus }) => {
  return (
    <ToolCard>
      <h2 className="text-2xl font-semibold mb-4 text-primary">Today's Focus</h2>
      <input
        type="text"
        value={focus}
        onChange={(e) => setFocus(e.target.value)}
        placeholder="What is your main goal today?"
        className="w-full bg-white/5 border-b-2 border-border-color focus:border-primary outline-none text-lg p-2 transition-colors"
      />
    </ToolCard>
  );
});

export default FocusCard; 