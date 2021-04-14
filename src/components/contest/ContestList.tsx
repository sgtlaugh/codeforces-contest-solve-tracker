import React from "react";
import { useSelector } from "react-redux";
import {
  getProblemUrl,
  formateDate,
  charInc,
  getContestUrl,
} from "../../util/bashforces";
import { ATTEMPTED_PROBLEMS, SOLVED_PROBLEMS } from "../../util/constants";

interface con{

};

const ContestList = (props) => {
  const state = useSelector((state) => state);

  const related = state.sharedProblems.problems;

  

  const getProblem = (contestId, index) => {
    let l = 0,
      r = state.problemList.problems.length - 1;
    while (l <= r) {
      let mid = l + ((r - l) >> 2);
      if (
        state.problemList.problems[mid].contestId === contestId &&
        state.problemList.problems[mid].index === index
      )
        return state.problemList.problems[mid];

      if (
        state.problemList.problems[mid].contestId > contestId ||
        (state.problemList.problems[mid].contestId === contestId &&
          state.problemList.problems[mid].index > index)
      )
        r = mid - 1;
      else l = mid + 1;
    }

    return -1;
  };

  const getStatus = (contestId, index, id, solveStatus) => {
    let res = state.userSubmissions[solveStatus].has(id);
    
    if (!res) {
      let sharedIndex = getSharedIndex(contestId, index);
      if (sharedIndex != -1) {
        for (let problem of related[sharedIndex].shared) {
          res |= state.userSubmissions[solveStatus].has(problem.id);
        }
      }
    }

    return res;
  };

  const renderProblem = (problem) => {
    let solved = getStatus(
      problem.contestId,
      problem.index,
      problem.id,
      SOLVED_PROBLEMS
    );
    let attempted = getStatus(
      problem.contestId,
      problem.index,
      problem.id,
      ATTEMPTED_PROBLEMS
    );

    let name = problem.name;
    let id = problem.id;
    if (name.length > 10) name = name.substring(0, 9) + "...";

    let className =
      (solved ? "bg-success" : attempted ? "bg-danger" : "") + " p-1";

    return (
      <td className={className} key={id}>
        <a
          className="text-light text-decoration-none"
          target="_blank"
          rel="noreferrer"
          tabIndex={0}
          data-bs-toggle="tooltip"
          title={problem.name + ", Rating:" + problem.rating}
          href={getProblemUrl(problem.contestId, problem.index)}>
          {problem.index + ". "}
          {name}
        </a>
      </td>
    );
  };

  const getSharedIndex = (contestId, index) => {
    let l = 0,
      r = related.length - 1;

    while (l <= r) {
      let mid = l + ((r - l) >> 2);
      if (related[mid].contestId === contestId && related[mid].index === index)
        return mid;
      if (
        related[mid].contestId > contestId ||
        (related[mid].contestId === contestId && related[mid].index > index)
      )
        r = mid - 1;
      else l = mid + 1;
    }

    return -1;
  };

  const getProblemsList = (contestId, index, first = true) => {
    let problem = getProblem(contestId, index);

    let problems = [];
    if (problem === -1) {
      let problem1 = getProblem(contestId, index + "1");
      if (problem1 === -1 && first === true) {
        let sharedIndex = getSharedIndex(contestId, index);
        if (sharedIndex != -1) {
          for (let sharedProblem of related[sharedIndex].shared) {
            let currentGetInfo = getProblemsList(
              sharedProblem.contestId,
              sharedProblem.index,
              false
            );

            if (currentGetInfo.length === 1 && currentGetInfo[0] === -1)
              continue;
            for (let currentProblem of currentGetInfo) {
              let current = { ...currentProblem };
              current.contestId = contestId;
              current.index = current.index.split("");
              current.index[0] = index.charAt(0);
              current.index = current.index.join("");
              current.id = current.contestId.toString() + index;
              problems.push(current);
            }
          }
        }
      } else {
        problems.push(problem1);
        for (let c:number = 2; c <=3; c++) {
          problem1 = getProblem(contestId, index + c.toString());
          if (problem1 === -1) break;
          problems.push(problem1);
        }
      }
    } else problems.push(problem);

    return problems;
  };

  const getInfo = (contestId, index) => {
    const EMPTY = "EMPTY bg-dark";

    let problems = getProblemsList(contestId, index);

    if (problems.length === 0) {
      return <td key={contestId + index} className={EMPTY}></td>;
    }

    if (problems.length === 1) {
      return renderProblem(problems[0]);
    }

    if (problems.length === 2) {
      return (
        <td className="p-0" key={contestId + index.charAt(0)}>
          <table>
            <tbody>
              <tr className="inside p-0" key={contestId + index}>
                {problems.map((element) => renderProblem(element))}
              </tr>
            </tbody>
          </table>
        </td>
      );
    }

    return (
      <td className="inside p-0" key={contestId + index}>
        More than 4
      </td>
    );
  };

  const contestCard = (contest) => {
    return (
      <tr key={contest.id}>
        <th scope="row">{contest.id}</th>
        <td>
          <div className="name">
            <a
              className="text-light text-decoration-none wrap"
              target="_blank"
              rel="noreferrer"
              title={formateDate(contest.startTimeSeconds)}
              href={getContestUrl(contest.id)}>
              {contest.name}
            </a>
          </div>
          {props.filterState.showDate ? (
            <div className="time">{formateDate(contest.startTimeSeconds)}</div>
          ) : (
            ""
          )}
        </td>
        {[...Array(7)].map((x, i) => {
          return getInfo(contest.id, charInc("A", i));
        })}
      </tr>
    );
  };

  return (
    <React.Fragment>
      {props.contestlist.map((contest) => {
        return contestCard(contest);
      })}
    </React.Fragment>
  );
};

export default ContestList;
