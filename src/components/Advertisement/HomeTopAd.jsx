import Advertisement from './Advertisement';

export default function HomeTopAd() {
  return (
    <div className="container mx-auto px-4 py-2">
      <Advertisement
        page="home"
        position="content-top"
        className="w-full"
      />
    </div>
  );
}
