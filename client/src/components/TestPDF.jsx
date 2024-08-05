import React from 'react';
import { PageTop, PageBottom, PageBreak } from "@fileforge/react-print";

export const Document = () => {
    return (
        <div>
            <PageTop>
                <span>Hello #1</span>
            </PageTop>
            <div>Hello #2</div>
            <PageBottom>
                <div className="text-gray-400 text-sm">Hello #3</div>
            </PageBottom>
            <PageBreak />
            <span>Hello #4, but on a new page!</span>
        </div>
    );
};
