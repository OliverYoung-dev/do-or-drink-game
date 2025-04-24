import Lottie from "lottie-react";
import partyAnimation from "../assets/lottie/loading-party.json";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-pink-600 text-white">
      <div className="text-center">
        <Lottie
          animationData={partyAnimation}
          loop={true}
          className="w-72 h-72 mx-auto"
        />
        <h2 className="text-2xl font-bold mt-4 animate-pulse">
        Getting the party started... hang tight!
      </h2>
      </div>
    </div>
  );
}
