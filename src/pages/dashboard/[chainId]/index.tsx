import type { NextPage } from "next";
import Container from "~/components/containers/Container";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useToken } from "wagmi";
import {
  NumberStatCard,
  ChainStatCard,
  DateStatCard,
  DataCard,
} from "~/components/StatCards";
import CardContainer from "~/components/containers/CardContainer";
import { xenContract } from "~/lib/xen-contract";
import { chainIcons } from "~/components/Constants";
import Link from "next/link";
import { chainList } from "~/lib/client";
import XENContext from "~/contexts/XENContext";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Breadcrumbs from "~/components/Breadcrumbs";

const Dashboard: NextPage = () => {
  const { t } = useTranslation("common");

  const router = useRouter();
  const { chainId } = router.query as unknown as { chainId: number };
  const chainFromId = chainList.find((c) => c && c.id == chainId);

  const {
    setChainOverride,
    totalSupply,
  } = useContext(XENContext);

  const { data: token } = useToken({
    address: xenContract(chainFromId).addressOrName,
    chainId: chainFromId?.id,
  });

  const stakeItems = [
    {
      title: t("card.total"),
      value: (totalSupply) / 1e18,
    },
    {
      title: t("card.liquid"),
      value: totalSupply / 1e18,
    },
  ];

  useEffect(() => {
    if (chainFromId) {
      setChainOverride(chainFromId);
    }
  }, [chainFromId, setChainOverride]);

  return (
    <div>
      <Container className="max-w-2xl">
        <Breadcrumbs />

        <div className="flex flex-col space-y-8">
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn m-1 glass text-neutral">
              {t("dashboard.select-chain")}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow rounded-box glass w-64 flex space-y-2"
            >
              {chainList
                .filter((chain) => !chain.testnet)
                .map((c) => (
                  <li key={c.id}>
                    <Link href={`/dashboard/${c.id}`}>
                      <a className="text-neutral justify-between glass">
                        {c.name}
                        {chainIcons[c.id]}
                      </a>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <CardContainer>
            <h2 className="card-title">{t("dashboard.general-stats")}</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              <ChainStatCard
                value={chainFromId?.name ?? "Ethereum"}
                id={chainFromId?.id ?? 1}
              />
              
              {token && (
                <DataCard
                  title={t("dashboard.token-address")}
                  value={token?.symbol ?? "XEN"}
                  description={xenContract(chainFromId).addressOrName}
                />
              )}
            </div>
          </CardContainer>

          <CardContainer>
            <h2 className="card-title">{t("dashboard.supply")}</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              {stakeItems.map((item, index) => (
                <NumberStatCard
                  key={index}
                  title={item.title}
                  value={item.value}
                />
              ))}
            </div>
          </CardContainer>
        </div>
      </Container>
    </div>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export const getStaticPaths = async ({ locales }: any) => {
  // generate locales paths for all chains and all locales
  const allPaths = chainList.flatMap((chain) =>
    locales.map((locale: string) => ({
      params: { chainId: chain.id.toString() },
      locale,
    }))
  );

  return {
    paths: allPaths,
    fallback: false,
  };
};

export default Dashboard;
