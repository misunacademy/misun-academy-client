const DashboardPageContainer = ({ heading, subheading, buttons, content }: {
    heading: string;
    subheading: string;
    buttons?: React.ReactNode;
    content?: React.ReactNode;
}) => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{heading}</h1>
                    <p className="text-muted-foreground">{subheading}</p>
                </div>
                {buttons}
            </div>
            {content}
        </div>
    );
};

export default DashboardPageContainer;