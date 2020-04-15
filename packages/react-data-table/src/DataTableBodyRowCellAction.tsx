import React, {useCallback} from 'react';
import component from '@ohoareau/react-component';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {useConfirm} from 'material-ui-confirm';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const DataTableBodyRowCellAction = component<DataTableBodyRowCellActionProps>({
    button: {
        marginRight: 5,
    },
}, ({buttonComponent, classes = {}, t = () => {}, tReady = false, expandedLabel, label, expanded, type, onClick, row, confirmable = false}: DataTableBodyRowCellActionProps) => {
    const Button: any = buttonComponent;
    const confirm = useConfirm();
    const handleConfirmableClick = e => {
        e.stopPropagation();
        confirm({
            title: t([`tables_generic_main_item_confirms_delete_title`]),
            description: t([`tables_generic_main_item_confirms_delete_description`], {
                ...row,
                objectType: t([`expression_one_type_generic`, ''])
            }),
            confirmationText: t([`tables_generic_main_item_confirms_delete_buttons_confirm_label`], row),
            cancellationText: t([`tables_generic_main_item_confirms_delete_buttons_cancel_label`], row),
        }).then(() => onClick && onClick(row));
    };
    const handleNonConfirmableClick = useCallback(e => {e.stopPropagation(); onClick && onClick(row)}, [onClick, row]);
    const handleClick = confirmable ? handleConfirmableClick : handleNonConfirmableClick;
    return (
        <div>
            {('icon' === type) && (
                <IconButton style={{marginLeft: 5}} color="secondary" size="small" onClick={handleClick}>
                    <DeleteIcon/>
                </IconButton>
            )}
            {('icon' !== type) && (
                <Button variant="outlined" color="inherit" size="small" className={classes.button} onClick={handleClick} startIcon={expanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>} label={t(expanded ? (expandedLabel || label) : label)} />
            )}
        </div>
    );
});

export interface DataTableBodyRowCellActionProps {
    buttonComponent?: Function,
    classes?: {[key: string]: any},
    t?: Function,
    tReady ?: boolean,
    expandedLabel?: string,
    label?: string,
    expanded?: boolean,
    type?: string,
    onClick?: Function,
    row?: any,
    confirmable?: boolean,
}

export default DataTableBodyRowCellAction