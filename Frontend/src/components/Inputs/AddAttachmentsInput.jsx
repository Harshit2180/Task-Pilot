import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2'

const AddAttachmentsInput = ({ attachments, setAttachments }) => {

    const [option, setOption] = useState("")

    const handleAddOption = () => {
        if (option.trim()) {
            setAttachments([...attachments, option.trim()])
        }
    }

    const handleDeleteOption = () => {
        const updatedArr = attachments.filter((_, idx) => idx !== index)
        setAttachments(updatedArr)
    }

    return (
        <div>AddAttachmentsInput</div>
    )
}

export default AddAttachmentsInput