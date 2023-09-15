import React from 'react';
import { useGetTsDocsForPackage } from '../dataHooks';
import { Code } from '../../../common/docs/Code';
import { TsComment } from './components/TsComment';
import { Layout } from './components/Layout';
import { ApiReferenceItemTable } from './ApiReferenceItemTable';
import { useSearchParams } from 'react-router-dom';

export function ApiReferenceItem() {
    const [params] = useSearchParams();
    const [p1, p2, exportName] = params.get('id').split('/');
    const packageName = `${p1}/${p2}`;
    const exportsMap = useGetTsDocsForPackage(packageName);
    const exportInfo = exportsMap?.[exportName];
    const {
        typeName,
        typeValue,
        comment,
    } = exportInfo || {};

    if (!exportInfo) {
        return null;
    }

    const items: { title?: string, node: React.ReactNode }[] = [];
    if (comment?.length > 0) {
        items.push({
            title: 'Description',
            node: <TsComment text={ comment } keepBreaks={ false } />,
        });
    }
    const hasProps = exportInfo?.props?.length > 0;
    if (hasProps) {
        items.push({
            node: <ApiReferenceItemTable packageName={ packageName } exportName={ exportName } showCode={ true } />,
        });
    }
    if (!hasProps) {
        items.push({
            node: <Code codeAsHtml={ typeValue.print?.join('\n') } />,
        });
    }

    return (
        <Layout title={ typeName.nameFull }>
            {items}
        </Layout>
    );
}
