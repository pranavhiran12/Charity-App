import { useParams } from "react-router-dom";
import GuestContributions from "./GuestContributions";

export default function GuestContributionsWrapper() {
    const { guestId } = useParams();

    return <GuestContributions guestId={guestId} />;
}
