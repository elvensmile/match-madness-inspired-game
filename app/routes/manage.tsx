import ManageWords from "~/components/manageWords";
import {useParams} from "react-router";


export default function ManagePage() {
    const params = useParams();
    return (
            <ManageWords />
    );
}
