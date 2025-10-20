export default function FooterComponent() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex h-12 max-w-screen-xl items-center justify-between px-4 text-xs text-slate-500">
        <div>
          Last updated:{" "}
          {new Date().toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
        <div className="flex items-center gap-2">Footer</div>
      </div>
    </footer>
  );
}
