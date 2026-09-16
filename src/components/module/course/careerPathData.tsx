interface SingleMissionProps {
    title: string;
    topics: string[];
    badge: string;
    badgeWidth?: number;
}

const SingleMission: React.FC<SingleMissionProps> = ({
    title,
    topics,
    badge,
}) => {
    return (
        <div className="relative border border-transparent max-w-sm lg:max-w-[540px] mx-auto min-h-full rounded-2xl transition-transform duration-500 ease-in-out z-10 hover:shadow-lg hover:-translate-y-1 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF3F1] to-[#fffaf9] transition-all duration-500 rounded-2xl group-hover:bg-[linear-gradient(248.43deg,rgba(255,86,54,0)_-15.67%,#FF5636_26.76%)]">
            </div>
            <div className="relative p-6 z-10 text-black hover:text-white">

                <div className="p-4 lg:p-6">
                    <div className='bg-[#FFE6E1] group-hover:bg-[#FFCBC166] w-fit px-2 py-1 rounded-lg text-primary group-hover:text-white'>
                        {badge}
                    </div>

                    <h3 className="text-xl lg:text-2xl font-semibold mt-3 mb-6">
                        {title}
                    </h3>

                    <ul className="pl-4 mt-2 space-y-2 text-sm lg:text-base list-disc">
                        {topics.map((topic: string) => (
                            <li key={topic}>{topic}</li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>

    );
};

const fullStackPath = [
    {
        badge: 'Mission 1',
        title: 'Be An HTML, CSS & Git Specialist',
        topics: [
            'Explore and set up VSCode for efficient coding',
            'Master HTML structure, tags, attributes & image embedding',
            'Dive into CSS & master styling techniques',
            'Learn GitHub for seamless version control & hosting'
        ],
    },
    {
        badge: 'Mission 2',
        title: 'Be The CSS Layout Genius',
        topics: [
            'Master Flex & Grid for perfect layouts',
            'Explore CSS transforms, transitions & animations',
            'Build responsive layouts with media queries',
            'Create visually stunning web pages'
        ],
    },
    {
        badge: 'Mission 3',
        title: 'Be The CSS Framework Perfectionist',
        topics: [
            'Master Tailwind for Rapid Styling',
            'Discover Tailwind Component Libraries',
            'Build Stunning, Modern Webpages',
            'Create Clean, Scalable, and Responsive Designs'
        ],
    },
    {
        badge: 'Mission 4',
        title: 'Be A JavaScript Sorcerer',
        topics: [
            'Understand Variables, Data Types & Keywords',
            'Dive deep into Arrays, Conditionals, Functions & Loops',
            'Master Explore JavaScript String & Objects',
            'Have Fun with Problem-Solving Challenges!'
        ],
    },
    {
        badge: 'Mission 5',
        title: 'Be The JavaScript Champion',
        topics: [
            'Master JavaScript Events, Event Bubbling & More',
            'Explore the DOM & Its Powerful Methods',
            'Build Fun & Interactive JavaScript Projects'
        ],
    },
    {
        badge: 'Mission 6',
        title: 'Be The JavaScript Overlord',
        topics: [
            'ES6 Features, Event Loop, Event Queue & V8 Mechanism',
            'Block Scope, Global Scope, Hoisting, Class, Closures & Callbacks',
            'Debugging, JavaScript APIs, Local & Session Storage',
            'Promises, Async/Await, Build Exciting API-Based Projects'
        ],
    },
    {
        badge: 'Mission 7',
        title: 'Be A React Rising Star',
        topics: [
            'Understand How React Works Under the Hood',
            'Master JSX, Props & State',
            'Explore React Hooks & Their Power',
            'Build a SPA with React & Integrate Local Storage'
        ],
    },
    {
        badge: 'Mission 8',
        title: 'Be The React Rebel',
        topics: [
            'Deep Dive into React Router, Axios & Custom Hooks',
            'Understand Prop Drilling & Set Up Context API',
            'Explore Ref, Controlled & Uncontrolled Components',
            'Build an Exciting Project with React Router'
        ],
    },
    {
        badge: 'Mission 9',
        title: 'Be A Full Stack Explorer',
        topics: [
            'Understand how to implement Private Routes',
            'Set up Custom Authentication & explore TanStack Query',
            'Explore Node.js & Express.js',
            'Build an exciting project with Authentication'
        ],
    },
    {
        badge: 'Mission 10',
        title: 'Be A Mongoose Master',
        topics: [
            'Learn more about Node.js & Express.js',
            'Master MongoDB & Mongoose query techniques',
            'Understand MVC Pattern & Mongoose schema',
            'Work with the MongoDB aggregation framework'
        ],
    },
    {
        badge: 'Mission 11',
        title: 'Be A FullStack Brainiac ',
        topics: [
            'Perform CRUD operations with Mongoose',
            'Implement JWT authentication & Axios Interceptor',
            'Add Pagination, Searching, Sorting, and Filtering',
            'Follow industry best practices and design patterns'
        ],
    },
    {
        badge: 'Mission 12',
        title: 'Become A FullStack Developer',
        topics: [
            'Build a large-scale full-stack project',
            'Apply everything you\u2019ve learned',
            'Follow best practices for scalability and performance',
            ' Prepare for UCL with hands-on experience'
        ],
    },


];

export { fullStackPath, SingleMission };
export type { SingleMissionProps };
