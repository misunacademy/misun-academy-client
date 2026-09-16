import { Button } from "@/components/ui/button";
import { Loader2, Download, RefreshCcw } from "lucide-react";

const clash = "'Clash Display', sans-serif";

export default function CertificateActions({
    isValid,
    isDownloading,
    isTemplateLoaded,
    onRefresh,
    onDownloadPdf,
    onDownloadPng,
}: {
    isValid: boolean;
    isDownloading: boolean;
    isTemplateLoaded: boolean;
    onRefresh: () => void;
    onDownloadPdf: () => void;
    onDownloadPng: () => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={onRefresh} style={{ fontFamily: clash }}>
                <RefreshCcw className="h-4 w-4 mr-1" /> Refresh
            </Button>

            {isValid && (
                <>
                    <Button
                        variant="default" size="sm"
                        onClick={onDownloadPdf}
                        disabled={isDownloading || !isTemplateLoaded}
                        style={{ fontFamily: clash }}
                    >
                        {isDownloading
                            ? <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            : <Download className="h-4 w-4 mr-1" />}
                        Download PDF
                    </Button>

                    <Button
                        variant="outline" size="sm"
                        onClick={onDownloadPng}
                        disabled={isDownloading || !isTemplateLoaded}
                        style={{ fontFamily: clash }}
                    >
                        {isDownloading
                            ? <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            : <Download className="h-4 w-4 mr-1" />}
                        Download PNG
                    </Button>
                </>
            )}
        </div>
    );
}
