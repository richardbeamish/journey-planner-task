import { Injectable } from '@angular/core';

import { Result } from '../shared/result';

@Injectable({
  providedIn: 'root'
})
export class CalculateJourneyService {

  private nodes = [];
  private adjacencyList = {};

  public init(data: any) {
    // Transform supplied JSON data into a graph
    const addNode = (node: any) => {
      if (this.nodes.indexOf(node) === -1) {
        this.nodes.push(node);
        this.adjacencyList[node] = [];
      }
    }

    const addEdge = (node1: string, node2: string, weight: string) => {
      this.adjacencyList[node1].push({
        node: node2,
        weight: weight
      })
    }

    data.map(journey => {
      addNode(journey.DepartStation);
      addNode(journey.ArriveStation);
      addEdge(journey.DepartStation, journey.ArriveStation, journey.Time);
    });
  }

  public processJourney(start: string, destination: string) {

    let priorityQueue = [];

    const enqueue = (element) => {
      if (priorityQueue.length === 0) {
        priorityQueue.push(element);
      } else {
        let added = false;
        for (let i = 1; i <= priorityQueue.length; i++) {
          if (element[1] < priorityQueue[i - 1][1]) {
            priorityQueue.splice(i - 1, 0, element);
            added = true;
            break;
          }
        }
        if (!added) {
          priorityQueue.push(element);
        }
      }
    }

    const dequeue = () => {
      let value = priorityQueue.shift();
      return value;
    }

    const findPathWithDijkstra = (startNode, endNode) => {
      let times = {};
      let backtrace = {};

      // Initialise the times
      times[startNode] = 0;
      this.nodes.forEach(node => {
        if (node !== startNode) {
          times[node] = Infinity;
        }
      });

      enqueue([startNode, 0]);

      while (priorityQueue.length !== 0) {
        let shortestStep = dequeue();
        let currentNode = shortestStep[0];

        this.adjacencyList[currentNode].forEach(neighbour => {
          let time = times[currentNode] + neighbour.weight;

          if (time < times[neighbour.node]) {
            times[neighbour.node] = time;
            backtrace[neighbour.node] = currentNode;
            enqueue([neighbour.node, time]);
          }

        });
      }

      let path = [endNode];
      let lastStep = endNode;

      while (lastStep !== startNode) {
        path.unshift(backtrace[lastStep]);
        lastStep = backtrace[lastStep];
      }

      const result = new Result();
      result.path = path;
      result.changes = path.length - 2;
      result.time = times[endNode];

      return result;
    }

    return findPathWithDijkstra(start, destination);
  }

}
