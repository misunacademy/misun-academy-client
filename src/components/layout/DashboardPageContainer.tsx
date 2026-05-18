const DashboardPageContainer = ({ heading, subheading, buttons, content }: {
    heading: React.ReactNode;
    subheading?: React.ReactNode;
    buttons?: React.ReactNode;
    content?: React.ReactNode;
}) => {
    const renderHeading = typeof heading === 'string'
        ? <h1 className="text-3xl font-bold">{heading}</h1>
        : heading;
    const renderSubheading = typeof subheading === 'string'
        ? <p className="text-muted-foreground">{subheading}</p>
        : subheading;
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    {renderHeading}
                    {subheading ? renderSubheading : null}
                </div>
                {buttons}
            </div>
            {content}
        </div>
    );
};

export default DashboardPageContainer;