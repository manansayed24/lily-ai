import { Headphones } from "./Headphones";
import { isBrowser } from "react-device-detect";
import { Spinner } from "@nextui-org/react";

export const InitialLoad = ({ fn, connecting = true }: { fn: () => void, connecting: boolean }) => {
  return (
    <>
      <div className="col-start-1 col-end-13 sm:col-start-2  sm:col-end-12 md:col-start-3 md:col-end-11 lg:col-start-4 lg:col-end-10 p-3 mb-1/2">
        <button
          disabled={connecting}
          onClick={() => !connecting && fn()}
          type="button"
          className="relative block w-full glass p-6 sm:p-8 lg:p-12 rounded-xl"
        >
          <h2 className="font-favorit mt-2 block font-bold text-xl text-gray-100">
            {/* Welcome to Deepgram&apos;s */}
            Important Instructions
            <br />
            {/* AI Agent Tech Demo. */}
          </h2>
          <div className="flex  mt-4">
            <ul className="list-disc list-inside marker:text-[#13EF93]">
              <li className="text-start">Use high-quality, comfortable headphones for the best audio experience during the interview.</li>
              <li className="text-start">Choose a silent room with minimal background noise, closing windows and doors to reduce external disturbances.</li>
              <li className="text-start">The interview will last 20-30 minutes; plan accordingly and ensure you have sufficient uninterrupted time.</li>
              <li className="text-start">You will have only one attempt to complete the interview, which cannot be paused or restarted once begun.</li>
              <li className="text-start">Ensure a stable, fast internet connection (minimum 10 Mbps download, 3 Mbps upload), preferably using wired ethernet.</li>
              <li className="text-start">Use an up-to-date modern web browser such as Google Chrome, Mozilla Firefox, or Microsoft Edge.</li>
            </ul>
          </div>
          <span className="mt-4 block font-semibold">
            <div className="bg-white text-black rounded px-6 md:px-8 py-3 font-semibold sm:w-fit sm:mx-auto opacity-90">
              {connecting ? (
                <div className="w-full h-full items-center flex justify-center opacity-40 cursor-not-allowed">
                  <Spinner size={"sm"} className="-mt-1 mr-2" />
                  Connecting...
                </div>
              ) : (
                <>{isBrowser ? "Click" : "Tap"} here to start Interview</>
              )}
            </div>
          </span>
          <span className="mt-4 block text-sm text-gray-100/70">
            <Headphones /> For optimal enjoyment, we recommend using headphones
            while using this application.
          </span>
        </button>
      </div>
    </>
  );
};
