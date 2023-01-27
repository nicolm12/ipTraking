import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import arrow from "./images/icon-arrow.svg";
import bg from "./images/pattern-bg.png";
import icon from "./icon-map";

function App() {
  const [address, setAddress] = useState(null);
  const [ip, setIp] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_DBj6YxNGvUcNR1XZgf2VXvSoJQuiP&ipAddress=192.212.174.101`
        );
        const data = await res.json();
        setAddress(data);
      };
      getInitialData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function searchAddress() {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_DBj6YxNGvUcNR1XZgf2VXvSoJQuiP&${
        checkIpAddress.test(ip)
          ? `ipAddress=${ip}`
          : checkDomain.test(ip)
          ? `domain=${ip}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
  }

  function handleSubmit(e) {
    e.preventDefault()
    searchAddress()
    setIp("")
  }


  return (
    <>
      <div>
        <div className="absolute -z-10 w-full">
          <img src={bg} alt="" className="w-full h-80" />
        </div>
        <div className="p-8">
          <h1 className="text-2xl text-center text-white font-bold mb-8 lg:text-3xl">
            {" "}
            IP Address Tracker
          </h1>
          <form autoComplete="off" onSubmit={handleSubmit} className="flex justify-center max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for any IP address or domain"
              required
              className="py-2 px-4 rounded-l-lg w-full"
              value={ip}
              onChange={(e)=> setIp(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black py-4 px-4 rounded-r-lg hover:opacity-60"
            >
              <img src={arrow} alt="" />
            </button>
          </form>
        </div>
        {address && (
          <>
            <article
              className="bg-white rounded-lg shadow p-8 mx-8 grid grid-cols-1 gap-8 md:grid-cols-4  max-w-6xl xl:mx-auto text-center md:text-left lg:-mb-16 relative"
              style={{ zIndex: 1000 }}
            >
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase  text-sm font-bold text-slate-300 tracking-wider mb-3">
                 IP ADDRESS
                </h2>
                <p className="font-semibold text-black text-lg md:text-xl">
                   {address.ip}
                </p>
              </div>
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase  text-sm font-bold text-slate-300 tracking-wider mb-3">
                  LOCATION
                </h2>
                <p className="font-semibold text-black text-lg md:text-xl">
                {address.location.region}
                </p>
              </div>
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase  text-sm font-bold text-slate-300 tracking-wider mb-3">
                  TIMEZONE
                </h2>
                <p className="font-semibold text-black text-lg md:text-xl">
                  UTC{address.location.timezone}
                </p>
              </div>
              <div>
                <h2 className="uppercase  text-sm font-bold text-slate-300 tracking-wider mb-3">
                  ISP
                </h2>
                <p className="font-semibold text-black text-lg md:text-xl">
                  {address.isp}
                </p>
              </div>
            </article>
            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker icon={icon} position={[address.location.lat, address.location.lng]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </>
        )}
      </div>
    </>
  );
}

export default App;
