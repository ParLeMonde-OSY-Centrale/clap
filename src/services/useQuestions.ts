import { useQueryCache, useQuery, QueryFunction } from "react-query";
import React from "react";

import { UserServiceContext } from "src/services/UserService";
import { serializeToQueryUrl } from "src/util";
import type { Question } from "types/models/question.type";

export const useQuestions = (args: { isDefault?: boolean; scenarioId?: string | number | null; languageCode?: string } = {}): { questions: Question[]; setQuestions(questions: Question[]): void } => {
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const queryCache = useQueryCache();
  const getQuestions: QueryFunction<Question[]> = React.useCallback(async () => {
    if (!args.scenarioId && args.scenarioId !== 0) {
      return [];
    }
    const response = await axiosLoggedRequest({
      method: "GET",
      url: `/questions${serializeToQueryUrl(args)}`,
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [args, axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<Question[], unknown>(["questions", args], getQuestions);
  const setQuestions = React.useCallback(
    (q: Question[]) => {
      queryCache.setQueryData(["questions", args], q);
    },
    [args, queryCache],
  );
  return {
    questions: isLoading || error ? [] : data,
    setQuestions,
  };
};

export const useQuestionRequests = (): { getDefaultQuestions(args: { isDefault?: boolean; scenarioId: string | number | null; languageCode?: string }): Promise<Question[]> } => {
  const queryCache = useQueryCache();
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const getDefaultQuestions = React.useCallback(
    async (args: { isDefault?: boolean; scenarioId: string | number | null; languageCode?: string }): Promise<Question[]> => {
      if (args.scenarioId === null || typeof args.scenarioId === "string") {
        return [];
      }
      const url: string = `/questions${serializeToQueryUrl(args)}`;
      const response =
        (queryCache.getQueryData(["questions", "user-default", args]) as { error?: unknown; data: Question[] }) ||
        (await queryCache.fetchQuery(["questions", "user-default", args], async () =>
          axiosLoggedRequest({
            method: "GET",
            url,
          }),
        ));
      if (!response.error) {
        return response.data;
      }
      return [];
    },
    [queryCache, axiosLoggedRequest],
  );

  return { getDefaultQuestions };
};
