/**
 * Component for displaying tips and screenshot instructions
 */
import { TIPS } from '../../../lib/constants';
import { KeyboardKey, Icon } from '../../../components/ui';

const TipsSection = () => {
    return (
        <>
            {/* Best practices tips */}
            <div className="mt-4 text-sm text-gray-400 bg-gray-700 p-4 rounded-lg border border-gray-600">
                <p className="font-medium text-gray-200 mb-2">📸 Tips for best results:</p>
                <ul className="list-disc pl-5 space-y-1">
                    {TIPS.bestPractices.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </div>

            {/* Screenshot instructions */}
            <div className="mt-4 bg-gradient-to-r from-gray-800 to-[#30B3A4]/20 p-5 rounded-lg border border-[#30B3A4]/30">
                <p className="font-medium text-white mb-3 flex items-center">
                    <Icon name="info" className="mr-2 text-[#30B3A4]" />
                    How to take screenshots:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Windows instructions */}
                    <div className="bg-gray-700/50 p-3 rounded-md">
                        <p className="font-medium text-[#30B3A4] mb-2">Windows:</p>
                        <ul className="space-y-1 text-gray-300">
                            {TIPS.screenshotWindows.map((item, index) => (
                                <li key={index}>
                                    <KeyboardKey keys={item.key} /> {item.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Mac instructions */}
                    <div className="bg-gray-700/50 p-3 rounded-md">
                        <p className="font-medium text-[#30B3A4] mb-2">Mac:</p>
                        <ul className="space-y-1 text-gray-300">
                            {TIPS.screenshotMac.map((item, index) => (
                                <li key={index}>
                                    <KeyboardKey keys={item.key} /> {item.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TipsSection;
