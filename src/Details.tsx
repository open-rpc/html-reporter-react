import 'react';
import {
  Accordion,
  AppShell,
  Group,
  Image,
  Pill,
  rem,
  Text,
  Title,
} from '@mantine/core';
import { useLocation, useRoute, useSearch } from 'wouter';
import XIcon from './XIcon';
import DisplayTimeInSeconds from './DisplayTimeInSeconds';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import CheckIcon from './CheckIcon';
import { useEffect, useState } from 'react';
import { navigateWithSearchAndHash } from './utils';

const Details = () => {
  const [location, setLocation] = useLocation();
  const [report, setReport] = useState<any[]>([]);
  const [item, setItem] = useState<any>();
  const [match, params] = useRoute('/details/:id');
  const reportUrl = import.meta.env.REPORT_URL?.startsWith('http') ? import.meta.env.REPORT_URL : import.meta.env.BASE_URL + import.meta.env.REPORT_URL;
  const searchString = useSearch();
  // get reporturl from search params
  const searchParams = new URLSearchParams(searchString);
  const reportUrlFromSearchParams = searchParams.get('reportUrl');

  console.log('params', params);

  useEffect(() => {
    const windowOpenrpcReport = (window as any).openrpcReport;
    if (windowOpenrpcReport && !reportUrlFromSearchParams) {
      setReport(windowOpenrpcReport);
      const it = windowOpenrpcReport.find(
        (_item: any) => _item.id === Number(params?.id),
      );
      setItem(it);
      return;
    }
    fetch(reportUrlFromSearchParams || reportUrl)
      .then((res) => res.json())
      .then((data) => {
        const it = data.find(
          (_item: any) => _item.id === Number(params?.id),
        );
        setItem(it);
        setReport(data);
      });
  }, []);
  window.scrollTo(0, 0);
  console.log('in details', match, item, report);
  // `match` is a boolean

  if (!match) {
    return null;
  }

  if (!item) {
    return null;
  }

  if (report.length === 0) {
    return null;
  }

  return (
    <AppShell header={{ height: 60 }} pl={50} pr={50} pt={10} pb={10}>
      <AppShell.Header pl={20}>
        <Group
          style={{
            alignItems: 'center',
            height: '60px',
            justifyContent: 'flex-start',
            cursor: 'pointer'
          }}
          onClick={() => {
            navigateWithSearchAndHash('/', searchString, { state: null });
          }}
        >
          <Image
            alt="playground-title"
            height="30"
            src="https://github.com/open-rpc/design/raw/master/icons/open-rpc-logo-noText/open-rpc-logo-noText%20(PNG)/128x128.png"
          />
          <Title size="lg" pl={0} ml={0}>
            API Test HTML Reporter
          </Title>
        </Group>
      </AppShell.Header>
      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        <>
          <Title pt={15} pb={10}>
            {item.title}
          </Title>
          <Pill c="indigo">{item.rule}</Pill>

          <Accordion
            defaultValue={'Test'}
            styles={{
              root: {
                border: '1px solid var(--mantine-color-default-border)',
                borderRadius: '5px',
                width: '100%',
                marginBottom: '30px',
                marginTop: '30px',
              },
              content: {
                width: '100%'
              }
            }}
          >
            <Accordion.Item value={'Test'} style={{width: '100%'}}>
              <Accordion.Control style={{width: '100%'}}>
                <Group style={{ justifyContent: 'space-between' }}>
                  <Group>
                    <div style={{ width: '20px', height: '20px' }}>
                      {item.valid ? <CheckIcon /> : <XIcon />}
                    </div>
                    <Text>Test</Text>
                  </Group>
                  <Group>
                    <Pill>{item.methodName}</Pill>
                    <DisplayTimeInSeconds
                      style={{ paddingRight: '5px' }}
                      threshold={10}
                      time={
                        (item.timings.endTime - item.timings.startTime) / 1000
                      }
                    ></DisplayTimeInSeconds>
                  </Group>
                </Group>
              </Accordion.Control>
              <Accordion.Panel
                style={{
                  borderTop: '1px solid var(--mantine-color-default-border)',
                  display: 'flex',
                  width: '100%',
                  padding: 0,
                }}
                p={30}
              >
                {item.reason && (
                  <>
                    <Title size={20}>Reason</Title>
                    <code>
                      <pre>
                        <Text>{item.reason}</Text>
                      </pre>
                    </code>
                  </>
                )}
                <div style={{ width: '100%' }}>
                  <Title size={20} pb={20}>Request</Title>
                  <div
                    style={{
                      background: 'var(--mantine-color-dark-9)',
                      width: '100%',
                      padding: '30px',
                    }}
                  >
                    <JsonView
                      src={{
                        id: item.id,
                        jsonrpc: '2.0',
                        method: item.methodName,
                        params: item.params,
                      }}
                      displaySize={false}
                      theme="a11y"
                      dark={true}
                    />
                  </div>
                </div>
                <div style={{ width: '100%', paddingTop: '30px', paddingBottom: '30px' }}>
                  <Title size={20} pb={20}>Response</Title>
                  <div
                    style={{
                      background: 'var(--mantine-color-dark-9)',
                      width: '100%',
                      padding: '30px',
                    }}
                  >
                    <JsonView
                      src={
                        item.result !== undefined
                          ? {
                              id: item.id,
                              jsonrpc: '2.0',
                              result: item.result,
                            }
                          : {
                              id: item.id,
                              jsonrpc: '2.0',
                              error: item.error,
                            }
                      }
                      dark={true}
                      theme="a11y"
                      displaySize={false}
                    />
                  </div>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Accordion
            defaultValue={'Attachments'}
            style={{
              border: '1px solid var(--mantine-color-default-border)',
              borderRadius: '5px',
              width: '100%',
              marginBottom: '30px',
            }}
          >
            <Accordion.Item value={'Attachments'}>
              <Accordion.Control>
                <Group style={{ justifyContent: 'space-between' }}>
                  <Text>Attachments</Text>
                  <Text c="gray">
                    {((item as any).attachments &&
                      (item as any).attachments.length) ||
                      '0'}
                  </Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel
                style={{
                  borderTop: '1px solid var(--mantine-color-default-border)',
                  display: 'flex',
                  padding: 0,
                }}
                p={20}
              >
                {(!(item as any).attachments ||
                  !((item.attachments as any).length > 0)) &&
                  'No Attachments.'}
                {item.attachments &&
                  item.attachments.map((attachment: any) => (
                    <Group style={{ paddingBottom: '10px' }}>
                      <Pill>{attachment.type}</Pill>
                      {attachment.type === 'image' && (
                        <>
                          <Image src={attachment.data}/>
                        </>
                      )}
                      {attachment.type === 'text' && (
                        <Text>{attachment.data}</Text>
                      )}
                    </Group>
                  ))}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </>
      </AppShell.Main>
    </AppShell>
  );
};

export default Details;
