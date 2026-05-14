import DarkLight from "./DarkLight";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm  md:w-full w-11/12 md:max-w-3xl max-w-4xl mx-auto sm:py-1 sm:px-6 px-2 border rounded-full shadow-sm">
      <div className="container mx-auto px-4 py-1 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} ChatNinjas. All rights reserved.
        </p>
        <DarkLight />
      </div>
    </footer>
  );
}
