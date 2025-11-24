export default function StatsSection() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
                    <h2 className="text-4xl font-semibold lg:text-5xl">Online Bank in Numbers</h2>
                    <p>Our Online Banking features have surpassed amazing feats with the strengths of our API and collaboration with Chase bank to locate ATMs for our users</p>
                </div>

                <div className="grid gap-0.5 *:text-center md:grid-cols-3 dark:[--color-muted:var(--color-zinc-900)]">
                    <div className="bg-muted rounded-(--radius) space-y-4 py-12">
                        <div className="text-5xl font-bold">+5</div>
                        <p>Active Users</p>
                    </div>
                    <div className="bg-muted rounded-(--radius) space-y-4 py-12">
                        <div className="text-5xl font-bold">+67%</div>
                        <p>Transfer speeds relative to G2 and G3</p>
                    </div>
                    <div className="bg-muted rounded-(--radius) space-y-4 py-12">
                        <div className="text-5xl font-bold">4%</div>
                        <p>APY, for a wealthy future</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
