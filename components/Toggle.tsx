import { Switch } from "@chakra-ui/react";
import { autorun } from "mobx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export enum Switches {
    FixFormButton = "fix_form_button"
}


export function useToggle() {
    const [toggle, setToggle] = useState(false);
    return {
        toJSON: () => ({
            setItem: setToggle,
            getItem: toggle
        }),
        currentState: toggle,
        setState: setToggle
    }
}

function resolveBoolean(str: string): boolean {
    if (str == "true") return true;
    else if (str == "false") return false;
    else return false;
}

export function Toggle({ switchName, itemName, getItem: item, setItem: _item }: {
    switchName: Switches;
    itemName: string;
    setItem: Dispatch<SetStateAction<boolean>>;
    getItem: boolean;
}) {
    let [initialCheck, checkState] = useState(false);
    useEffect(() => {
        if (initialCheck) return;
        const switchValue = localStorage.getItem(switchName);
        console.log(switchValue)
        if (switchValue != null) {
            checkState(true);
            _item(
                resolveBoolean(switchValue)
            );
        }

        console.log(switchValue, switchName)
    }, [_item, switchName, item, initialCheck]);

    useEffect(() => {
        if (!initialCheck) return;
        localStorage.setItem(switchName, JSON.stringify(item))
        console.log("switch", item)
    }, [switchName, item, initialCheck]);

    return (
        <Switch isChecked={item} onChange={() => _item(item == true ? false : true)}>{itemName} ({JSON.stringify(item)})</Switch>
    )
}
