import 'react';
import {
  Accordion,
  AppShell,
  Divider,
  Group,
  Image,
  rem,
  TagsInput,
  Text,
  Title,
} from '@mantine/core';
import ListItemCard from './ListItemCard';
import DisplayTimeInSeconds from './DisplayTimeInSeconds';
import { useLocation, useSearch } from 'wouter';
import { ReportStats } from './ReportStats';
import { useEffect, useState } from 'react';
import { navigateWithSearchAndHash } from './utils';

const failingString = '❌ Failing';
const passingString = '✅ Passing';
const missingString = '❔ Missing';

const statuses = [failingString, passingString, missingString];

const getReportByRules = (report: any) => {
  const reportByRules = (report as any).reduce((acc: any, item: any) => {
    if (!acc[item.rule]) {
      acc[item.rule] = [];
    }
    acc[item.rule].push(item);
    return acc;
  }, {});
  return reportByRules;
};

const getReportByMethods = (report: any) => {
  const reportByMethods = (report as any).reduce((acc: any, item: any) => {
    if (!acc[item.methodName]) {
      acc[item.methodName] = [];
    }
    acc[item.methodName].push(item);
    return acc;
  }, {});
  return reportByMethods;
};

const Home = () => {
  const [location, setLocation] = useLocation();
  const [report, setReport] = useState<any[]>([]);
  const searchString = useSearch();
  const reportUrl = import.meta.env.REPORT_URL.startsWith('http') ? import.meta.env.REPORT_URL : import.meta.env.BASE_URL + import.meta.env.REPORT_URL;
  const searchParams = new URLSearchParams(searchString);
  const reportUrlFromSearchParams = searchParams.get('reporturl');

  useEffect(() => {
    const windowOpenrpcReport = (window as any).openrpcReport;
    if (windowOpenrpcReport && !reportUrlFromSearchParams) {
      setReport(windowOpenrpcReport);
      return;
    }
    fetch(reportUrlFromSearchParams || reportUrl)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
      });
  }, []);

  const [reportByRules, setReportByRules] = useState<any>();
  const [reportByMethods, setReportByMethods] = useState<any>();

  useEffect(() => {
    setReportByRules(getReportByRules(report));
    setReportByMethods(getReportByMethods(report));
    setCurrentFilter(getReportByRules(report));
  }, [report]);
  const [currentFilter, setCurrentFilter] = useState(reportByRules);
  const [searchInputValue, setSearchInputValue] = useState<any>();

  const filterByValues = (values: string[]) => {
    if (values.length === 0) {
      setCurrentFilter(reportByRules);
    } else {
      const filtered = (report as any).filter((item: any) => {
        const statusConditions = values.filter(value => value === failingString || value === passingString);
        const methodConditions = values.filter(value => value !== failingString && value !== passingString);

        const statusCheck = statusConditions.length === 0 || statusConditions.every(status => {
          return (status === failingString && !item.valid) || (status === passingString && item.valid);
        });

        const methodCheck = methodConditions.length === 0 || methodConditions.some(method => item.methodName.includes(method));

        return (statusCheck && methodCheck);
      });
      setCurrentFilter(getReportByRules(filtered));
    }
  };
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
        <ReportStats report={report} onClick={(value: string) => {
          const searchValue = statuses.find((status: string) => status.endsWith(value));
          if (searchInputValue && searchInputValue.includes(searchValue)) {
            setSearchInputValue(searchInputValue.filter((item: string) => item !== searchValue));
            return filterByValues(searchInputValue.filter((item: string) => item !== searchValue));
          }

          if (!searchValue) {
            return;
          }
          setSearchInputValue([searchValue]);
          filterByValues([searchValue]);
        }} />

        <TagsInput
          style={{ marginBottom: '30px' }}
          placeholder="Search by method or status"
          value={searchInputValue}
          data={[
            { group: 'Status', items: statuses },
            {
              group: 'Methods',
              items: Object.entries(reportByMethods).map(
                ([method]: any) => method,
              ),
            },
          ]}
          onChange={(values: string[]) => {
            setSearchInputValue(values);
            filterByValues(values);
          }}
        />
        {Object.entries(currentFilter).map(([rule, items]: any) => (
          <Accordion
            defaultValue={rule}
            style={{
              border: '1px solid var(--mantine-color-default-border)',
              borderRadius: '5px',
              width: '100%',
              marginBottom: '30px',
            }}
          >
            <Accordion.Item value={rule}>
              <Accordion.Control>
                <Group style={{ justifyContent: 'space-between' }}>
                  <Text>{rule}</Text>
                  <DisplayTimeInSeconds
                    style={{ paddingRight: '5px' }}
                    threshold={10}
                    time={
                      items.reduce(
                        (acc: number, item: any) =>
                          acc + (item.timings.endTime - item.timings.startTime),
                        0,
                      ) / 1000
                    }
                  ></DisplayTimeInSeconds>
                </Group>
              </Accordion.Control>
              <Accordion.Panel
                style={{
                  borderTop: '1px solid var(--mantine-color-default-border)',
                  padding: 0,
                }}
                p={0}
              >
                {items.map((item: any) => (
                  <>
                    <ListItemCard
                      item={item}
                      onClick={() => {
                        // setLocation(`/details/${item.id}${searchString ? `?${searchString}` : ''}`);
                        navigateWithSearchAndHash(`/details/${item.id}`, `${searchString ? `?${searchString}` : ''}`);
                      }}
                    />
                    <Divider style={{ width: '100%' }} />
                  </>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ))}
      </AppShell.Main>
    </AppShell>
  );
};

export default Home;
