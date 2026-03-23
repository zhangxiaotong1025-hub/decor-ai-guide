import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "@/components/chat/ChatHeader";
import DiscoveryFeed from "@/components/discovery/DiscoveryFeed";
import SceneStorySheet from "@/components/discovery/SceneStorySheet";
import type { SceneStory } from "@/data/mockSceneStories";

const Discover = () => {
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<SceneStory | null>(null);
  const [storySheetOpen, setStorySheetOpen] = useState(false);

  const handleSelectStory = useCallback((story: SceneStory) => {
    setSelectedStory(story);
    setStorySheetOpen(true);
  }, []);

  const handleStartChat = useCallback(
    (prompt: string) => {
      setStorySheetOpen(false);
      // Navigate to a new project with the prompt as state
      setTimeout(() => {
        navigate("/project/new", { state: { initialPrompt: prompt } });
      }, 300);
    },
    [navigate]
  );

  return (
    <div className="h-full flex flex-col">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <DiscoveryFeed onStartChat={handleStartChat} onSelectStory={handleSelectStory} />
        </div>
      </div>

      <SceneStorySheet
        story={selectedStory}
        isOpen={storySheetOpen}
        bottomInset={56}
        onClose={() => setStorySheetOpen(false)}
        onStartChat={handleStartChat}
      />
    </div>
  );
};

export default Discover;
