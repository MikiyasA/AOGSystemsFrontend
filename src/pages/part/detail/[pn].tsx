import PartDetail from "@/components/PartDetail"
import Layout from "@/hocs/Layout"
import { useGetPartByPNQuery } from "@/pages/api/apiSlice"
import { useRouter } from "next/router"


const Detail = () => {

    const route = useRouter()
    const {data: part, isLoading} = useGetPartByPNQuery(route?.query.pn)
    console.log('query',route?.query.pn)
    return(
        <Layout
            title={`Part Detail of ${part ? part.partNumber : ''}`}
            description="Part Detail"
        >
            <PartDetail part={part} />
        </Layout>
    )
}
export default Detail