import { Bold, Italic, Underline } from "lucide-react"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useShortEditor } from "@/contexts/ShortEditorContext"

const MultiToggle = () => {
    const { toggleValue, setToggleValue } = useShortEditor()
    return (
        <div className="flex text-sm items-center gap-4 w-full justify-start">
            <div className="w-fit h-fit border border-silver/10 rounded-lg">
                <ToggleGroup
                    value={toggleValue}
                    type="single"
                    onValueChange={(value: string)=>{
                        setToggleValue(value)
                    }}
                    >
                    <ToggleGroupItem value="generated" aria-label="Toggle generated">
                        <p className="py-1 px-2 text-sm">Generated</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="original" aria-label="Toggle original">
                        <p className="py-1 px-2 text-sm">Original</p>
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
            Video
        </div>
    )
}

export default MultiToggle