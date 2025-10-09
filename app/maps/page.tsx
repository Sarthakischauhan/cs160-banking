export default async function Home() {
    // TODO: Make the user input query client side. Then use api call

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/maps?q=Chase ATMs Near Me`);
    const data = await res.json();
    console.log(data)
    
    return (
        <div></div>
    )
}